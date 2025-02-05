import { AxiosError } from "axios";
import { withoutRole } from "src/lib/auth";
import { isChatEnable } from "src/lib/isChatEnable";
import { createInferenceClient } from "src/lib/oasst_inference_client";
import { InferencePostAssistantMessageParams } from "src/types/Chat";

const handler = withoutRole("banned", async (req, res, token) => {
  if (!isChatEnable()) {
    return res.status(404).end();
  }
  const client = createInferenceClient(token);

  try {
    const data = await client.post_assistant_message(req.body as InferencePostAssistantMessageParams);
    return res.status(200).json(data);
  } catch (e) {
    if (!(e instanceof AxiosError)) {
      return res.status(500).end();
    }
    console.log(e);
    return res.status(e.response?.status ?? 500).json({ message: e.response?.data.detail ?? "Something went wrong" });
  }
});

export default handler;
