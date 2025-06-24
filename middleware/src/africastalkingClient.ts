import africastalking  from "africastalking";

const aft = africastalking({
    username:"sandbox",
    apiKey:process.env.AFRICAS_TALKING_TOKEN!,
})


export default aft;