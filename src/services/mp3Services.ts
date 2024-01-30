export const countMP3Frames = async (mp3Buffer: Buffer): Promise<number> => {
    let offset = 0;
    let frames = 0;

    while (offset < mp3Buffer.length - 4) {
        if (await isFrameHeader(mp3Buffer, offset)) {
            frames++;
            offset += 4; 
        } else {
            offset++;
        }
    }

    return frames;
};

const isFrameHeader = async (buffer: Buffer, offset: number): Promise<boolean> => {
    return (
        buffer[offset] === 0xFF &&
        (buffer[offset + 1] & 0xE0) === 0xE0 &&
        (buffer[offset + 1] & 0x18) !== 0x08
    );
};



