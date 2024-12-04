use serde_wasm_bindgen::{from_value, to_value};
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
        Self {
            service: LanguageService::default(),
        }
    }

    #[wasm_bindgen]
    pub fn initialize(&mut self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.initialize(from_value(params)?)).map_err(JsValue::from)
    }

    #[wasm_bindgen]
    pub fn commit(&mut self, uri: String, content: String) -> Result<(), JsValue> {
        self.service.commit(
            uri.parse()
                .map_err(|_| format!("failed to parse URI: {uri}"))?,
            content,
        );
        Ok(())
    }

    #[wasm_bindgen]
    pub fn hover(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.hover(from_value(params)?)).map_err(JsValue::from)
    }
}
