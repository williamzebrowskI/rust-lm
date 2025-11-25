use axum::{http::StatusCode, routing::{get, post}, Json, Router};
use axum::serve;
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tracing::{error, info};

#[derive(Debug, Deserialize)]
struct Checks {
    #[serde(default)]
    must_include: Vec<String>,
    #[serde(default)]
    must_not_include: Vec<String>,
}

#[derive(Debug, Deserialize)]
struct RunRequest {
    user_code: String,
    tests: String,
    exercise_id: String,
    lesson_id: Option<String>,
    lesson_title: Option<String>,
    #[serde(default)]
    checks: Option<Checks>,
}

#[derive(Debug, Serialize)]
struct TestResult {
    name: String,
    pass: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    message: Option<String>,
}

#[derive(Debug, Serialize)]
struct RunResult {
    success: bool,
    results: Vec<TestResult>,
    #[serde(skip_serializing_if = "Option::is_none")]
    raw_output: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    notes: Option<String>,
}

#[derive(thiserror::Error, Debug)]
enum RunError {
    #[error("missing field: {0}")]
    MissingField(&'static str),
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt()
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    let app = Router::new()
        .route("/health", get(health))
        .route("/api/run-tests", post(run_tests))
        .layer(CorsLayer::new().allow_methods(Any).allow_origin(Any).allow_headers(Any));

    let port = std::env::var("PORT").unwrap_or_else(|_| "4000".to_string());
    let addr: SocketAddr = format!("0.0.0.0:{}", port)
        .parse()
        .expect("invalid port");
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind listener");
    info!("listening on http://{}", addr);
    serve(listener, app).await.expect("server error");
}

async fn health() -> Json<serde_json::Value> {
    Json(serde_json::json!({ "status": "ok", "message": "Rust learning backend is up" }))
}

async fn run_tests(Json(req): Json<RunRequest>) -> (StatusCode, Json<serde_json::Value>) {
    match handle_run(req).await {
        Ok(result) => (StatusCode::OK, Json(serde_json::to_value(result).unwrap())),
        Err(err) => {
            error!(?err, "run-tests failure");
            (
                StatusCode::BAD_REQUEST,
                Json(serde_json::json!({ "success": false, "error": err.to_string() })),
            )
        }
    }
}

async fn handle_run(req: RunRequest) -> Result<RunResult, RunError> {
    if req.user_code.trim().is_empty() {
        return Err(RunError::MissingField("userCode"));
    }
    if req.tests.trim().is_empty() {
        return Err(RunError::MissingField("tests"));
    }
    if req.exercise_id.trim().is_empty() {
        return Err(RunError::MissingField("exerciseId"));
    }

    // Keep optional metadata alive (used for future logging/analytics).
    let _ = (&req.lesson_id, &req.lesson_title);

    let mut results: Vec<TestResult> = Vec::new();

    if req.user_code.contains("todo!") {
        results.push(TestResult {
            name: "no_todo".into(),
            pass: false,
            message: Some("Replace todo! with working Rust code.".into()),
        });
    }

    if let Some(checks) = req.checks {
        for snippet in checks.must_include {
            let pass = req.user_code.contains(&snippet);
            results.push(TestResult {
                name: format!("must include: {}", snippet),
                pass,
                message: if pass {
                    Some("ok".into())
                } else {
                    Some(format!("Missing required snippet: {}", snippet))
                },
            });
        }
        for snippet in checks.must_not_include {
            let pass = !req.user_code.contains(&snippet);
            results.push(TestResult {
                name: format!("must not include: {}", snippet),
                pass,
                message: if pass {
                    Some("ok".into())
                } else {
                    Some(format!("Remove forbidden snippet: {}", snippet))
                },
            });
        }
    }

    if results.is_empty() {
        results.push(TestResult {
            name: "static_checks".into(),
            pass: true,
            message: Some("Static checks passed.".into()),
        });
    }

    let success = results.iter().all(|r| r.pass);

    Ok(RunResult {
        success,
        results,
        raw_output: None,
        notes: None,
    })
}
