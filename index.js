const { Server } = require("socket.io");

const PORT = process.env.PORT || 3000;

const io = new Server(PORT, {
  cors: {
    origin: "*", // Permite conexões do seu site no Lovable e do iframe do Discord
    methods: ["GET", "POST"]
  },
  perMessageDeflate: false, // Desativa compressão para eliminar delay de CPU
  maxHttpBufferSize: 1e7    // Suporta até 10MB por chunk de vídeo
});

io.on("connection", (socket) => {
  // Entra na sala específica da transmissão
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  });

  // Recebe o ArrayBuffer binário e repassa imediatamente para quem está assistindo
  socket.on("stream-chunk", ({ roomId, chunk }) => {
    socket.to(roomId).emit("render-chunk", chunk);
  });
});

console.log(`Servidor Relay rodando na porta ${PORT}`);