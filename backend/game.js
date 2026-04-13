const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const Scoreboard = require("./models/Scoreboard");
const User = require("./models/User");

module.exports = (server) => {
    const wss = new WebSocket.Server({ server });

    let waitingPlayer = null;

    function checkWinner(board) {
        const combos = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]],
        ];

        for (let c of combos) {
            const [a, b, c2] = c;
            const v1 = board[a[0]][a[1]];
            const v2 = board[b[0]][b[1]];
            const v3 = board[c2[0]][c2[1]];

            if (v1 && v1 === v2 && v1 === v3) return v1;
        }
        return null;
    }

    wss.on("connection", (ws) => {

        ws.on("message", async (message) => {
            const data = JSON.parse(message);

            // 🟢 JOIN
            if (data.type === "join") {
                try {
                    const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
                    ws.userId = decoded.userId;

                    const user = await User.findById(decoded.userId);
                    ws.userName = user.userName;

                } catch {
                    ws.close();
                }
            }

            // 🟢 MATCHMAKING
            if (data.type === "find_game") {
                if (!waitingPlayer) {
                    waitingPlayer = ws;
                    ws.send(JSON.stringify({ type: "waiting" }));
                } else {
                    const player1 = waitingPlayer;
                    const player2 = ws;

                    player1.opponent = player2;
                    player2.opponent = player1;

                    player1.symbol = "X";
                    player2.symbol = "O";

                    const game = {
                        board: [
                            [null, null, null],
                            [null, null, null],
                            [null, null, null],
                        ],
                        turn: "X"
                    };

                    player1.game = game;
                    player2.game = game;

                    player1.send(JSON.stringify({
                        type: "start",
                        symbol: "X",
                        opponentName: player2.userName
                    }));

                    player2.send(JSON.stringify({
                        type: "start",
                        symbol: "O",
                        opponentName: player1.userName
                    }));

                    waitingPlayer = null;
                }
            }


            if (data.type === "move") {
                const game = ws.game;
                if (!game) return;

                const { row, col } = data.square;


                if (ws.symbol !== game.turn) return;


                if (game.board[row][col] !== null) return;

                // ✅ حط الحركة
                game.board[row][col] = ws.symbol;


                game.turn = game.turn === "X" ? "O" : "X";


                ws.send(JSON.stringify({
                    type: "move",
                    square: data.square,
                    player: ws.symbol
                }));

                ws.opponent.send(JSON.stringify({
                    type: "move",
                    square: data.square,
                    player: ws.symbol
                }));


                const winner = checkWinner(game.board);

                if (winner) {

                    const player1 = ws;
                    const player2 = ws.opponent;

                    if (winner === player1.symbol) {
                        await Scoreboard.findOneAndUpdate(
                            { userId: player1.userId },
                            { $inc: { wins: 1 } },
                            { upsert: true }
                        );

                        await Scoreboard.findOneAndUpdate(
                            { userId: player2.userId },
                            { $inc: { losses: 1 } },
                            { upsert: true }
                        );
                    } else {
                        await Scoreboard.findOneAndUpdate(
                            { userId: player2.userId },
                            { $inc: { wins: 1 } },
                            { upsert: true }
                        );

                        await Scoreboard.findOneAndUpdate(
                            { userId: player1.userId },
                            { $inc: { losses: 1 } },
                            { upsert: true }
                        );
                    }
                    const isDraw = game.board.flat().every(cell => cell !== null);

                    if (isDraw && !winner) {
                        await Scoreboard.findOneAndUpdate(
                            { userId: player1.userId },
                            { $inc: { draws: 1 } },
                            { upsert: true }
                        );

                        await Scoreboard.findOneAndUpdate(
                            { userId: player2.userId },
                            { $inc: { draws: 1 } },
                            { upsert: true }
                        );

                        player1.send(JSON.stringify({ type: "gameOver", winner: "draw" }));
                        player2.send(JSON.stringify({ type: "gameOver", winner: "draw" }));
                    }

                    player1.send(JSON.stringify({ type: "gameOver", winner }));
                    player2.send(JSON.stringify({ type: "gameOver", winner }));
                }
            }
        });

        ws.on("close", () => {
            if (ws.opponent) {
                ws.opponent.send(JSON.stringify({ type: "opponentLeft" }));
                ws.opponent.opponent = null;
            }

            if (waitingPlayer === ws) {
                waitingPlayer = null;
            }
        });

    });
};
