import { 
        ModalBuilder,
        TextInputBuilder,
        TextInputStyle,
        LabelBuilder,
        StringSelectMenuBuilder
    }
 from "discord.js";
import languageFile from "../../../Data/languages.json";

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
        type: "SelectMenu", 
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

    if (input.type === "SelectMenu") {
        const languageSelectMenu = new StringSelectMenuBuilder()
            .setCustomId(input.id)
            .setPlaceholder("Select a language")
            .addOptions(
                Object.entries(languageFile.Languages).map(([key, lang]) => ({
                    label: lang,
                    value: key
                }))
            );

        ruleBookModal.addLabelComponents(
            new LabelBuilder()
                .setLabel(input.label)
                .setStringSelectMenuComponent(languageSelectMenu)
        );
    }else{
        ruleBookModal.addLabelComponents(label);
    }
}