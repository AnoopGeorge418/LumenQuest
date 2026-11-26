use axum::{response::Html, routing::get, Router};
use scalar_api_reference::scalar_html_default;
use serde_json::json;

async fn scalar_docs() -> Html<String> {    
    let configuration = json!({
       "url": "/api/v1/openapi/json",
       "theme": "deepSpace"
    });
    
    Html(scalar_html_default(&configuration))
}

pub fn router() -> Router {
    Router::new().route("/docs", get(scalar_docs))
}
