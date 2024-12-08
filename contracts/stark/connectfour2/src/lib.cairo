
use starknet::ContractAddress;

#[starknet::interface]
trait IConnect4<TContractState> {
    fn create_game(ref self: TContractState, player2: ContractAddress) -> u32;
    fn is_player_in_game(self: @TContractState, player: ContractAddress) -> bool;
    fn make_move(ref self: TContractState, game_id: u32, column: u8) -> bool;
    fn get_board(self: @TContractState, game_id: u32) -> Array<u8>;
    fn get_player_gameId(self: @TContractState, player: ContractAddress) -> u32;
    fn get_game_winner(self: @TContractState, game_id: u32) -> ContractAddress;
    fn get_current_turn(self: @TContractState, game_id: u32) -> ContractAddress;
    fn get_player1 (self: @TContractState, game_id: u32) -> ContractAddress;
    fn get_player2 (self: @TContractState, game_id: u32) -> ContractAddress;
}

#[starknet::contract]
pub mod Connect4 {
    use core::starknet::storage::{StoragePointerReadAccess, StoragePointerWriteAccess,StoragePathEntry, Map, Vec, MutableVecTrait};
    use core::array::ArrayTrait;
    use core::traits::Into;
    use starknet::{ContractAddress,get_caller_address};


    const ROWS: usize = 6;
    const COLS: usize = 7;
    const BOARD_SIZE: usize = ROWS * COLS;
    const EMPTY: u8 = 0;
    const PLAYER1: u8 = 1;
    const PLAYER2: u8 = 2;

    #[storage]
    struct Storage {
        player1games: Map::<u32,ContractAddress>,
        player2games: Map::<u32,ContractAddress>,
        current_turn: Map::<u32,ContractAddress>,
        board_games: Map::<u32, Vec<u8>>,
        over_games: Map::<u32,bool>,
        winner_games: Map::<u32,ContractAddress>,
        active_games: Map::<ContractAddress, u32>,
        game_counter: u32,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        GameCreated: GameCreated,
        MoveMade: MoveMade,
        GameOver: GameOver,
        GameDraw: GameDraw,
    }

    #[derive(Drop, starknet::Event)]
    struct GameCreated {
        game_id: u32,
        player1: ContractAddress,
        player2: ContractAddress,
        first_turn: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct MoveMade {
        game_id: u32,
        player: ContractAddress,
        column: u8,
    }

    #[derive(Drop, starknet::Event)]
    struct GameOver {
        game_id: u32,
        winner: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct GameDraw {
        game_id: u32,
    }

    #[constructor]
    fn constructor(ref self: ContractState) {
        self.game_counter.write(0_u32);
    }

    #[abi(embed_v0)]
    impl Connect4Impl of super::IConnect4<ContractState> {
        fn create_game(ref self: ContractState, player2: ContractAddress) -> u32 {
            let player1 = get_caller_address();
            
            // Check players aren't in other games
            assert(!self.is_player_in_game(player1), 'Player1 in another game');
            assert(!self.is_player_in_game(player2), 'Player2 in another game');
            assert(player1 != player2, 'Players are the same');
            let game_id = self.game_counter.read();

            let mut j = 0;

            loop {
                if j >= BOARD_SIZE {
                    break;
                }
            self.board_games.entry(game_id + 1).append().write(0);
                j += 1;
            };

            let hash = 32_u8;
            let first_player = if hash % 2 == 0 { player1 } else { player2 };

            self.player1games.entry(game_id + 1).write(player1);
            self.player2games.entry(game_id + 1).write(player2);
            self.current_turn.entry(game_id + 1).write(first_player);
            self.over_games.entry(game_id + 1).write(false);
            self.active_games.entry(player1).write(game_id + 1);
            self.active_games.entry(player2).write(game_id + 1);
            self.game_counter.write(game_id + 1);
            game_id
        }

        fn make_move(ref self: ContractState, game_id: u32, column: u8) -> bool {
            let caller = get_caller_address();
            let game_over = self.over_games.entry(game_id).read();
            let current_turn = self.current_turn.entry(game_id).read();
            assert(!game_over, 'Game is over');
            assert(current_turn == caller, 'Not your turn');
            assert(column.into() < COLS, 'Invalid column');

            // Find first empty row in column
            let mut row = ROWS - 1;
            let mut found = false;
            loop {
                if row >= 0 {
                    let index = (row * COLS + column.into()).into();
                    if self.board_games.entry(game_id).at(index).read() == 0 {
                        found = true;
                        break;
                    }
                    row -= 1;
                } else {
                    break;
                }
            };
            assert(found, 'Column is full');

            // Make move
            let player_token = if caller == self.player1games.entry(game_id).read() { PLAYER1 } else { PLAYER2 };
            let index = (row * COLS + column.into()).into();
            self.board_games.entry(game_id)[index].write(player_token);

            let mut board = array![];
            let mut i:u64 = 0;
            loop {
                if i >= BOARD_SIZE.into() {
                    break;
                }
                board.append(self.board_games.entry(game_id)[i].read());
                i += 1;
            };
            // // Check for win
            if self.check_win(board.span(),row, column, player_token) {
                self.over_games.entry(game_id).write(true);
                self.winner_games.entry(game_id).write(caller);
                self.emit(GameOver { game_id, winner: caller });
            } 
            else if self.is_board_full(board.span()) {
                self.over_games.entry(game_id).write(true);
                self.emit(GameDraw { game_id});

            } else {
                // Switch turns
                self.current_turn.entry(game_id).write(if caller == self.player1games.entry(game_id).read() { self.player2games.entry(game_id).read() } else { self.player1games.entry(game_id).read() });
            }

            // self.current_turn.entry(game_id).write(if caller == self.player1games.entry(game_id).read() { self.player2games.entry(game_id).read() } else { self.player1games.entry(game_id).read() });

            self.emit(MoveMade { game_id, player: caller, column });
            self.over_games.entry(game_id).read()
        }

        fn get_board(self: @ContractState, game_id: u32) -> Array<u8> {
            let mut board = ArrayTrait::new();
            let mut i:u64 = 0;
            loop {
                if i >= BOARD_SIZE.into() {
                    break;
                }
                let game = self.board_games.entry(game_id)[i].read();
                board.append(game);
                i += 1;
            };
            board
        }

        fn get_player_gameId(self: @ContractState, player: ContractAddress) -> u32 {
            self.active_games.entry(player).read()
        }

        fn get_game_winner(self: @ContractState, game_id: u32) -> ContractAddress {
            self.winner_games.entry(game_id).read()
        }

        fn get_current_turn(self: @ContractState, game_id: u32) -> ContractAddress {
            self.current_turn.entry(game_id).read()
        }

        fn get_player1 (self: @ContractState, game_id: u32) -> ContractAddress {
            self.player1games.entry(game_id).read()
        }

        fn get_player2 (self: @ContractState, game_id: u32) -> ContractAddress {
            self.player2games.entry(game_id).read()
        }

        fn is_player_in_game(self: @ContractState, player: ContractAddress) -> bool {
            let game_id = self.active_games.entry(player).read();
            if game_id == 0 {
                return false;
            }
            let game = self.over_games.entry(game_id).read();
            !game
        }
    }



    #[generate_trait]
    impl InternalFunctions of InternalFunctionsTrait {
        fn check_win(self: @ContractState,board:Span<u8>, row: u32, col: u8, player: u8) -> bool {
            // Check horizontal
            let mut count = 0;
            let mut c = 0;
            let mut game_over = false;
            loop {
                if c >= COLS {
                    break;
                }
                let index: u32 = (row * COLS + c).into();
                if *board.at(index) == player {
                    count += 1;
                    if count == 4 {
                        game_over = true;
                        break;
                    }
                } else {
                    count = 0;
                }
                c += 1;
            };

            if game_over {
                return true;
            }

            // Check vertical
            count = 0;
            let mut r = 0;
            loop {
                if r >= ROWS {
                    break;
                }
                let index = (r * COLS + col.into()).into();
                if *board.at(index) == player {
                    count += 1;
                    if count == 4 {
                        game_over = true;
                        break;

                    }
                } else {
                    count = 0;
                }
                r += 1;
            };
            if (game_over) {
                return true;
            }

            // // Check ascending diagonal (bottom-left to top-right)
            // count = 0;
            // let mut r:u32 = row.into();
            // let mut c:u32 = col.into();
            // loop {
            //     if r < 0 || c < 0 {
            //         break;
            //     }
            //     let index = (r * COLS + c).into();
            //     if *board.at(index) == player {
            //         count += 1;
            //         if count == 4 {
            //             game_over = true;
            //             break;
            //         }
            //     } else {
            //         count = 0;
            //     }
            //     r -= 1;
            //     c -= 1;
            // };
            // if game_over {
            //     return true;
            // }

            // count = 0;
            // r = row.into();
            // c = col.into();
            // loop {
            //     if r >= ROWS || c >= COLS {
            //         break;
            //     }
            //     let index = (r * COLS + c).into();
            //     if *board.at(index) == player {
            //         count += 1;
            //         if count == 4 {
            //             game_over = true;
            //             break;
            //         }
            //     } else {
            //         count = 0;
            //     }
            //     r += 1;
            //     c += 1;
            // };
            // if game_over {
            //     return true;
            // }

            // // Check descending diagonal (top-left to bottom-right)
            // count = 0;
            // r = row.into();
            // c = col.into();
            // loop {
            //     if r < 0 || c >= COLS {
            //         break;
            //     }
            //     let index = (r * COLS + c).into();
            //     if *board.at(index) == player {
            //         count += 1;
            //         if count == 4 {
            //             game_over = true;
            //             break;
            //         }
            //     } else {
            //         count = 0;
            //     }
            //     r -= 1;
            //     c += 1;
            // };
            // if game_over {
            //     return true;
            // }

            // count = 0;
            // r = row.into();
            // c = col.into();
            // loop {
            //     if r >= ROWS || c < 0 {
            //         break;
            //     }
            //     let index = (r * COLS + c).into();
            //     if *board.at(index) == player {
            //         count += 1;
            //         if count == 4 {
            //             game_over = true;
            //             break;
            //         }
            //     } else {
            //         count = 0;
            //     }
            //     r += 1;
            //     c -= 1;
            // };
            // if game_over {
            //     return true;
            // }


            false
        }

        fn is_board_full(self: @ContractState,board:Span<u8>) -> bool {
            let mut i:u32 = 0;
            let mut board_full = true;
            
            loop {
                if i.into() >= (BOARD_SIZE) {
                    break;
                }
                if *board[i] == 0_u8  {
                    board_full = false;
                    break;
                }
                i += 1;
            };
            board_full
        }
    }
}