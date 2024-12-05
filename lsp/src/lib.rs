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

    #[wasm_bindgen]
    pub fn hover(&self, params: JsValue) -> Result<JsValue, JsValue> {
        to_value(&self.service.hover(from_value(params)?)).map_err(JsValue::from)
    }
}
