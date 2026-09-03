const API_BASE_URL = "http://localhost:8000";

/**
 * The single place in the app that knows the backend's URL and JSON shape.
 * Components call these functions instead of using fetch() directly, so
 * the API contract only has to be updated in one place if it ever changes.
 */

async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    if (response.status === 422 && Array.isArray(body?.detail)) {
      const first = body.detail[0];
      return first?.msg
        ? `Invalid request: ${first.msg}.`
        : "Invalid request.";
    }
    if (typeof body?.detail === "string") {
      return body.detail;
    }
  } catch {
    // response body wasn't JSON — fall through to a generic message
  }

  if (response.status === 500) {
    return "The server encountered an error while generating the graph.";
  }
  return `Request failed with status ${response.status}.`;
}

export async function checkHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

export async function generateGraph(text) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/generate-graph`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });
  } catch {
    throw new Error(
      "Unable to reach the backend. Make sure it's running on localhost:8000."
    );
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const data = await response.json();

  if (!Array.isArray(data?.nodes) || !Array.isArray(data?.relationships)) {
    throw new Error("Unexpected response from the server.");
  }

  return data;
}
