import { 
        ModalBuilder,
        TextInputBuilder,
        TextInputStyle,
        LabelBuilder
    }
 from "discord.js";

export const ruleBookModal = new ModalBuilder()
    .setCustomId("ruleBookModal")
    .setTitle("Board Game Rulebooks");

const Inputs = [
    {
        id: "boardGameName",
        label: "Name",
        style: TextInputStyle.Short,
        required: true
    },
    {
        id: "rulebookLink",
        label: "Rulebook Link",
        style: TextInputStyle.Paragraph,
        required: true
    },
    {
        id: "language",
        label: "Language",
        style: TextInputStyle.Short,
        required: true
    },
];

for (const input of Inputs) {
    const textInput = new TextInputBuilder()
        .setCustomId(input.id)
        .setStyle(input.style)
        .setRequired(input.required);

    const label = new LabelBuilder()
        .setLabel(input.label)
        .setTextInputComponent(textInput);

    ruleBookModal.addLabelComponents(label);
}