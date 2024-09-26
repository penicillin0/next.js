use turbo_tasks::Vc;
use turbopack::module_options::{ModuleRule, ModuleRuleEffect};
use turbopack_ecmascript::EcmascriptInputTransform;

use super::module_rule_match_js_no_url;

pub fn get_simplifier_rule(enable_mdx_rs: bool) -> ModuleRule {
    ModuleRule::new(
        module_rule_match_js_no_url(enable_mdx_rs),
        vec![ModuleRuleEffect::ExtendEcmascriptTransforms {
            prepend: Vc::cell(vec![]),
            append: Vc::cell(vec![EcmascriptInputTransform::Simplifier]),
        }],
    )
}
