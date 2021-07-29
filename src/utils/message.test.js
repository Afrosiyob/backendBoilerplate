let expect = require("expect");
const { generateMessage, generateLocationMessage } = require("./message");

describe("Generate Message", () => {
    it("should generate correct message object", () => {
        let from = "qwert",
            text = "some text qwert",
            message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe("string");
        expect(message).toMatchObject({ from, text });
    });
});

describe("Generate location message", () => {
    it("it should generate curect location object", () => {
        let from = "JOJO",
            lat = 15,
            long = 126,
            url = `https://www.google.com/maps?q=${lat},${long}`,
            message = generateLocationMessage(from, lat, long);

        expect(typeof message.createdAt).toBe("string");
        expect(message).toMatchObject({ from, url });
    });
});