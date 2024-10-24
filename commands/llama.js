const axios = require("axios");
const name = "llama";

module.exports = {
  name,
  description: "Interact with Meta LLama 3.1-8b",
  async run({ api, send, args }){
    try {
    const user = args.join(" ");
    if (!user) throw new Error(`Usage: ${api.prefix + name} [your question]`);
    send("🔍 Please wait while we're answering your question...");
    const llama = await axios.get(api.echavie + "/ai?" + `model=@cf/meta/llama-3.1-8b-instruct&q=${user}`);
    if (!llama || !llama.data.success) throw new Error(llama.data.error || llama.data);
    return send(llama.data.result);
    } catch (error) {
      return send("An error occured. Try again later or use another command.\n\n" + error.message || error);
    }
  }
}