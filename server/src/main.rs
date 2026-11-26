mod routes;

#[tokio::main]
async fn main() {
    let app = routes::scalar_route::router();

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("failed to bind address");

    axum::serve(listener, app)
        .await
        .expect("server failed");
}
