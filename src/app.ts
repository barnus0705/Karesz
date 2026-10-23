import connectClient from "./Proccess/connect";

connectClient().catch((error) => {
    console.error(error);
    process.exit(1);
});
