use anyhow::{Context, Result};
use turbo_tasks::Vc;
use turbopack_core::{
    asset::{Asset, AssetContent},
    chunk::{AsyncModuleInfo, ChunkableModule, ChunkingContext, EvaluatableAsset},
    ident::AssetIdent,
    module::Module,
    reference::{ModuleReferences, SingleModuleReference},
    resolve::ModulePart,
};

use super::{
    chunk_item::EcmascriptModulePartChunkItem, get_part_id, part_of_module, split, split_module,
    PartId, SplitResult,
};
use crate::{
    chunk::{EcmascriptChunkPlaceable, EcmascriptExports},
    parse::ParseResult,
    references::analyse_ecmascript_module,
    AnalyzeEcmascriptModuleResult, EcmascriptAnalyzable, EcmascriptModuleAsset,
    EcmascriptModuleAssetType, EcmascriptModuleContent, EcmascriptParsable,
};

/// A reference to part of an ES module.
///
/// This type is used for an advanced tree shkaing.
#[turbo_tasks::value]
pub struct EcmascriptModulePartAsset {
    pub full_module: Vc<EcmascriptModuleAsset>,
    pub part: Vc<ModulePart>,
}

#[turbo_tasks::value_impl]
impl EcmascriptParsable for EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    async fn failsafe_parse(&self) -> Result<Vc<ParseResult>> {
        let parsed = self.full_module.failsafe_parse();
        let split_data = split(
            self.full_module.ident(),
            self.full_module.source(),
            parsed,
            self.full_module.options().await?.special_exports,
        );
        Ok(part_of_module(split_data, self.part))
    }
    #[turbo_tasks::function]
    fn parse_original(&self) -> Result<Vc<ParseResult>> {
        Ok(self.full_module.parse_original())
    }

    #[turbo_tasks::function]
    async fn ty(&self) -> Result<Vc<EcmascriptModuleAssetType>> {
        Ok(self.full_module.ty())
    }
}

#[turbo_tasks::value_impl]
impl EcmascriptAnalyzable for EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    async fn analyze(&self) -> Result<Vc<AnalyzeEcmascriptModuleResult>> {
        let part = self.part;
        Ok(analyse_ecmascript_module(self.full_module, Some(part)))
    }

    #[turbo_tasks::function]
    async fn module_content_without_analysis(&self) -> Result<Vc<EcmascriptModuleContent>> {
        Ok(self.full_module.module_content_without_analysis())
    }

    #[turbo_tasks::function]
    async fn module_content(
        &self,
        chunking_context: Vc<Box<dyn ChunkingContext>>,
        async_module_info: Option<Vc<AsyncModuleInfo>>,
    ) -> Result<Vc<EcmascriptModuleContent>> {
        Ok(self
            .full_module
            .module_content(chunking_context, async_module_info))
    }
}

#[turbo_tasks::value_impl]
impl EcmascriptModulePartAsset {
    /// Create a new instance of [Vc<EcmascriptModulePartAsset>], whcih consists
    /// of a pointer to the full module and the [ModulePart] pointing the part
    /// of the module.
    #[turbo_tasks::function]
    pub fn new(module: Vc<EcmascriptModuleAsset>, part: Vc<ModulePart>) -> Vc<Self> {
        EcmascriptModulePartAsset {
            full_module: module,
            part,
        }
        .cell()
    }

    #[turbo_tasks::function]
    pub async fn select_part(
        module: Vc<EcmascriptModuleAsset>,
        part: Vc<ModulePart>,
    ) -> Result<Vc<Box<dyn Module>>> {
        let split_result = split_module(module).await?;

        Ok(if matches!(&*split_result, SplitResult::Failed { .. }) {
            Vc::upcast(module)
        } else {
            Vc::upcast(EcmascriptModulePartAsset::new(module, part))
        })
    }

    #[turbo_tasks::function]
    pub async fn is_async_module(self: Vc<Self>) -> Result<Vc<bool>> {
        let this = self.await?;
        let result = this.full_module.analyze();

        if let Some(async_module) = *result.await?.async_module.await? {
            Ok(async_module.is_self_async(self.references()))
        } else {
            Ok(Vc::cell(false))
        }
    }
}

#[turbo_tasks::value_impl]
impl Module for EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    async fn ident(&self) -> Result<Vc<AssetIdent>> {
        let inner = self.full_module.ident();
        let result = split_module(self.full_module);

        match &*result.await? {
            SplitResult::Ok { .. } => Ok(inner.with_part(self.part)),
            SplitResult::Failed { .. } => Ok(inner),
        }
    }

    #[turbo_tasks::function]
    async fn references(&self) -> Result<Vc<ModuleReferences>> {
        let split_data = split_module(self.full_module).await?;

        let analyze = analyze(self.full_module, self.part).await?;

        let deps = match &*split_data {
            SplitResult::Ok { deps, .. } => deps,
            SplitResult::Failed { .. } => return Ok(analyze.references),
        };

        // Facade depends on evaluation and re-exports
        if matches!(&*self.part.await?, ModulePart::Facade | ModulePart::Exports) {
            return Ok(analyze.references);
        }

        let deps = {
            let part_id = get_part_id(&split_data, self.part)
                .await
                .with_context(|| format!("part {:?} is not found in the module", self.part))?;

            match deps.get(&part_id) {
                Some(v) => &**v,
                None => &[],
            }
        };

        let mut assets = deps
            .iter()
            .map(|part_id| {
                Ok(Vc::upcast(SingleModuleReference::new(
                    Vc::upcast(EcmascriptModulePartAsset::new(
                        self.full_module,
                        match part_id {
                            PartId::Internal(part_id) => ModulePart::internal(*part_id),
                            PartId::Export(name) => ModulePart::export(name.clone()),
                            _ => unreachable!(
                                "PartId other than Internal and Export should not be used here"
                            ),
                        },
                    )),
                    Vc::cell("ecmascript module part".into()),
                )))
            })
            .collect::<Result<Vec<_>>>()?;

        assets.extend(analyze.references.await?.iter().cloned());

        Ok(Vc::cell(assets))
    }
}

#[turbo_tasks::value_impl]
impl Asset for EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    fn content(&self) -> Vc<AssetContent> {
        self.full_module.content()
    }
}

#[turbo_tasks::value_impl]
impl EcmascriptChunkPlaceable for EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    async fn get_exports(self: Vc<Self>) -> Result<Vc<EcmascriptExports>> {
        Ok(self.analyze().await?.exports)
    }
}

#[turbo_tasks::value_impl]
impl ChunkableModule for EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    async fn as_chunk_item(
        self: Vc<Self>,
        chunking_context: Vc<Box<dyn ChunkingContext>>,
    ) -> Result<Vc<Box<dyn turbopack_core::chunk::ChunkItem>>> {
        Ok(Vc::upcast(
            EcmascriptModulePartChunkItem {
                module: self,
                chunking_context,
            }
            .cell(),
        ))
    }
}

#[turbo_tasks::value_impl]
impl EcmascriptModulePartAsset {
    #[turbo_tasks::function]
    pub(super) async fn analyze(&self) -> Result<Vc<AnalyzeEcmascriptModuleResult>> {
        Ok(analyze(self.full_module, self.part))
    }
}

#[turbo_tasks::function]
fn analyze(
    module: Vc<EcmascriptModuleAsset>,
    part: Vc<ModulePart>,
) -> Result<Vc<AnalyzeEcmascriptModuleResult>> {
    Ok(analyse_ecmascript_module(module, Some(part)))
}

#[turbo_tasks::value_impl]
impl EvaluatableAsset for EcmascriptModulePartAsset {}
