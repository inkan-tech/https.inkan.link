# Cline Behavior for `groq:openai/gpt-oss` Models

## 1. Request Formatting

1. **Messages payload**  
   - Must contain at least one **`user`** message (non‑empty) and optionally a **`system`** message for context.  
   - Do **not** send only a `system` message or an empty `messages` array.  

   ```json
   {
     "model": "groq:openai/gpt-oss",
     "messages": [
       {"role":"system","content":"You are a helpful assistant."},
       {"role":"user","content":"Your question here"}
     ]
   }
   ```

2. **Model name**  
   - Use the exact identifier `groq:openai/gpt-oss`. Typos or missing `groq:` prefix cause the API to return an empty `choices` array.

3. **Endpoint**  
   - Use the chat endpoint: `https://api.openai.com/v1/chat/completions` (or the provider‑specific endpoint that forwards to OpenAI).

4. **Token limits**  
   - Respect the model’s context window (e.g., 128 k tokens). Trim older messages if you approach the limit.

5. **Empty content**  
   - Ensure `content` fields are non‑empty strings. Empty user messages trigger the “Unexpected API Response” error.

## 2. Response Handling

1. **Validate response structure**  

   ```python
   resp = openai.ChatCompletion.create(...)
   if not resp.choices or not resp.choices[0].message:
       raise RuntimeError("No assistant message returned")
   ```

2. **Streaming**  
   - When `stream=True`, read the entire stream before processing.  

   ```python
   full = ""
   for chunk in response:
       if chunk.choices[0].delta.content:
           full += chunk.choices[0].delta.content
   ```

3. **Timeouts & retries**  

   ```python
   import time, requests, openai

   def chat_with_retry(messages, retries=3):
       for i in range(retries):
           try:
               return openai.ChatCompletion.create(
                   model="groq:openai/gpt-oss",
                   messages=messages,
                   timeout=30
               )
           except (openai.APIError, requests.exceptions.Timeout):
               if i == retries - 1:
                   raise
               time.sleep(2 ** i)  # exponential back‑off
   ```

4. **Logging**  

   ```python
   try:
       resp = openai.ChatCompletion.create(...)
   except openai.OpenAIError as e:
       print("OpenAI error:", e.http_status, e.error)
   ```

## 3. Error Mitigation

| Issue | Cause | Fix |
|------|------|-----|
| **No assistant message** | Empty `user` content, missing `user` role, or malformed `messages` array | Ensure a non‑empty `user` message and correct JSON structure |
| **Empty response** | Exceeded token limit, network timeout, or streaming stopped early | Set `timeout`, implement retries, read full stream |
| **Model not found** | Wrong model name (missing `groq:` prefix) | Use exact model identifier |
| **Truncated response** | Network interruption or client abort | Use retries, increase timeout |
| **Invalid JSON** | Syntax errors in request payload | Validate JSON before sending |

## 4. Common Fixes

- **Always include a non‑empty `user` message** (even if you think the `system` message is enough).  
- **Use the exact model identifier** `groq:openai/gpt-oss` (including the `groq:` prefix).  
- **Set a reasonable timeout** (≥ 30 seconds) and implement retry logic.  
- **Read the full response** when using `stream=True`; otherwise the final `assistant` message may be omitted.  
- **Validate the response** before using it: check that `resp.choices[0].message` exists.  
- **Log errors** and inspect raw responses when the error persists.

## 5. Pre‑Request Checklist

| ✅ | Item |
|---|---|
| System message present (if needed) | ✅ |
| Non‑empty user message | ✅ |
| Correct model identifier (`groq:openai/gpt-oss`) | ✅ |
| Correct endpoint (`/v1/chat/completions`) | ✅ |
| Properly formatted `messages` array | ✅ |
| Timeout set (≥30 s) | ✅ |
| Retry logic for network errors | ✅ |
| Response validation (check for `assistant` message) | ✅ |
| Logging of errors and raw responses | ✅ |

## 6. TL;DR

1. **Include a non‑empty `user` message (and optional `system`).**  
2. **Use exact model name `groq:openai/gpt-oss` and correct endpoint.**  
3. **Read the full response (especially when streaming).**  
4. **Add timeout, retries, and validate the response.**  
5. **Log errors and inspect raw responses if the error persists.**  

Following these guidelines eliminates the “Unexpected API Response: The language model did not provide any assistant messages” error for `groq:openai/gpt-oss` models.

*This file serves as the .clinerules guide for using the `groq:openai/gpt-oss` model within the Inkan project.*

## 7. Additional Debugging Steps

If you still encounter the “Unexpected API Response” error after following the checklist, try these additional steps:

1. **Inspect the raw HTTP response**  
   - Print the full response body before parsing.  
   - Verify that the JSON contains a `choices` array with at least one element and that `choices[0].message` exists.

2. **Check HTTP status code**  
   - A non‑200 status may indicate authentication or rate‑limit issues.  
   - Ensure your API key is valid and has sufficient quota.

3. **Validate JSON**  
   - Use a JSON validator to ensure the response is well‑formed.  
   - If the response is truncated, retry the request.

4. **Disable streaming**  
   - Set `stream=False` to receive a complete response in one payload, which can simplify debugging.

5. **Enable logging**  
   - Log the request payload and response headers to identify mismatches.

6. **Upgrade the SDK**  
   - Ensure you are using the latest version of the OpenAI SDK, as older versions may have bugs handling streaming responses.

7. **Contact support**  
   - If the issue persists, contact the provider with the request ID and response details.

---

*These additional steps should help you pinpoint and resolve the “Unexpected API Response” error.*
