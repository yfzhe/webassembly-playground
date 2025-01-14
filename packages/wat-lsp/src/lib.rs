use serde_wasm_bindgen::from_value;
use wasm_bindgen::prelude::*;
use wat_service::LanguageService;

#[wasm_bindgen]
pub struct LanguageServer {
    service: LanguageService,
}

#[wasm_bindgen]
impl LanguageServer {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        console_error_panic_hook::set_once();
        Self {
            service: LanguageService::default(),
        }
    }

    #[wasm_bindgen]
    pub fn initialize(&mut self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.initialize(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen]
    pub fn commit(&mut self, uri: JsValue, content: String) -> Result<(), JsValue> {
        self.service.commit(from_value(uri)?, content);
        Ok(())
    }

    #[wasm_bindgen(js_name = "callHierarchyIncomingCalls")]
    pub fn call_hierarchy_incoming_calls(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(
            &self
                .service
                .call_hierarchy_incoming_calls(from_value(params)?),
        )
        .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "callHierarchyOutgoingCalls")]
    pub fn call_hierarchy_outgoing_calls(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(
            &self
                .service
                .call_hierarchy_outgoing_calls(from_value(params)?),
        )
        .map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "codeAction")]
    pub fn code_action(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.code_action(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen]
    pub fn completion(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.completion(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "documentHighlight")]
    pub fn document_highlight(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.document_highlight(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "documentSymbol")]
    pub fn document_symbol(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.document_symbol(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "findReferences")]
    pub fn find_references(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.find_references(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "foldingRange")]
    pub fn folding_range(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.folding_range(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen]
    pub fn formatting(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.formatting(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "gotoDeclaration")]
    pub fn goto_declaration(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.goto_declaration(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "gotoDefinition")]
    pub fn goto_definition(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.goto_definition(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "gotoTypeDefinition")]
    pub fn goto_type_definition(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.goto_type_definition(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen]
    pub fn hover(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.hover(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "inlayHint")]
    pub fn inlay_hint(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.inlay_hint(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "prepareCallHierarchy")]
    pub fn prepare_call_hierarchy(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.prepare_call_hierarchy(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "prepareRename")]
    pub fn prepare_rename(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.prepare_rename(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "pullDiagnostics")]
    pub fn pull_diagnostics(&self, uri: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.pull_diagnostics(from_value(uri)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "rangeFormatting")]
    pub fn range_formatting(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.range_formatting(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen]
    pub fn rename(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.rename(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "selectionRange")]
    pub fn selection_range(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.selection_range(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "signatureHelp")]
    pub fn signature_help(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.signature_help(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "semanticTokensFull")]
    pub fn semantic_tokens_full(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.semantic_tokens_full(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen(js_name = "semanticTokensRange")]
    pub fn semantic_tokens_range(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.semantic_tokens_range(from_value(params)?)).map_err(JsValue::from)
    }
}

pub fn to_value<T: serde::ser::Serialize + ?Sized>(
    value: &T,
) -> Result<JsValue, serde_wasm_bindgen::Error> {
    value.serialize(&serde_wasm_bindgen::Serializer::json_compatible())
}
