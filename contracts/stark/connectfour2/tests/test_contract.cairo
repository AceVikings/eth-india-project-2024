use starknet::ContractAddress;
use snforge_std::{declare, ContractClassTrait, DeclareResultTrait};
use Connect4::{IConnect4Dispatcher, IConnect4DispatcherTrait};

fn deploy_contract(name: ByteArray) -> ContractAddress {
    let contract = declare(name).unwrap().contract_class();
    let (contract_address, _) = contract.deploy(@array![]).unwrap();

    contract_address
}

#[test]
fn test_create_game() {
    let contract_address = deploy_contract("Connect4");
    let dispatcher = IConnect4Dispatcher { contract_address };

    let player2 = ContractAddress::from(0x1234);
    let game_id = dispatcher.create_game(player2);

    assert(game_id == 1, 'Game ID should be 1');
}

#[test]
fn test_make_move() {
    let contract_address = deploy_contract("Connect4");
    let dispatcher = IConnect4Dispatcher { contract_address };

    let player2 = ContractAddress::from(0x1234);
    let game_id = dispatcher.create_game(player2);

    let result = dispatcher.make_move(game_id, 0);
    assert(result, 'Move should be successful');
}

#[test]
fn test_check_win_horizontal() {
    let contract_address = deploy_contract("Connect4");
    let dispatcher = IConnect4Dispatcher { contract_address };

    let player2 = ContractAddress::from(0x1234);
    let game_id = dispatcher.create_game(player2);

    dispatcher.make_move(game_id, 0);
    dispatcher.make_move(game_id, 1);
    dispatcher.make_move(game_id, 2);
    dispatcher.make_move(game_id, 3);

    let winner = dispatcher.get_game_winner(game_id);
    assert(winner == dispatcher.get_player1(game_id), 'Player 1 should win');
}

#[test]
fn test_check_win_vertical() {
    let contract_address = deploy_contract("Connect4");
    let dispatcher = IConnect4Dispatcher { contract_address };

    let player2 = ContractAddress::from(0x1234);
    let game_id = dispatcher.create_game(player2);

    dispatcher.make_move(game_id, 0);
    dispatcher.make_move(game_id, 0);
    dispatcher.make_move(game_id, 0);
    dispatcher.make_move(game_id, 0);

    let winner = dispatcher.get_game_winner(game_id);
    assert(winner == dispatcher.get_player1(game_id), 'Player 1 should win');
}

#[test]
fn test_check_win_diagonal() {
    let contract_address = deploy_contract("Connect4");
    let dispatcher = IConnect4Dispatcher { contract_address };

    let player2 = ContractAddress::from(0x1234);
    let game_id = dispatcher.create_game(player2);

    dispatcher.make_move(game_id, 0);
    dispatcher.make_move(game_id, 1);
    dispatcher.make_move(game_id, 1);
    dispatcher.make_move(game_id, 2);
    dispatcher.make_move(game_id, 2);
    dispatcher.make_move(game_id, 2);
    dispatcher.make_move(game_id, 3);
    dispatcher.make_move(game_id, 3);
    dispatcher.make_move(game_id, 3);
    dispatcher.make_move(game_id, 3);

    let winner = dispatcher.get_game_winner(game_id);
    assert(winner == dispatcher.get_player1(game_id), 'Player 1 should win');
}