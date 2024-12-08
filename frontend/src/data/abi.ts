export const connect4abi = [
  {
    type: "impl",
    name: "Connect4Impl",
    interface_name: "connectfour::IConnect4",
  },
  {
    type: "enum",
    name: "core::bool",
    variants: [
      { name: "False", type: "()" },
      { name: "True", type: "()" },
    ],
  },
  {
    type: "interface",
    name: "connectfour::IConnect4",
    items: [
      {
        type: "function",
        name: "create_game",
        inputs: [
          {
            name: "player2",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "is_player_in_game",
        inputs: [
          {
            name: "player",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [{ type: "core::bool" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "make_move",
        inputs: [
          { name: "game_id", type: "core::integer::u32" },
          { name: "column", type: "core::integer::u8" },
        ],
        outputs: [{ type: "core::bool" }],
        state_mutability: "external",
      },
      {
        type: "function",
        name: "get_board",
        inputs: [{ name: "game_id", type: "core::integer::u32" }],
        outputs: [{ type: "core::array::Array::<core::integer::u8>" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_player_gameId",
        inputs: [
          {
            name: "player",
            type: "core::starknet::contract_address::ContractAddress",
          },
        ],
        outputs: [{ type: "core::integer::u32" }],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_game_winner",
        inputs: [{ name: "game_id", type: "core::integer::u32" }],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_current_turn",
        inputs: [{ name: "game_id", type: "core::integer::u32" }],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_player1",
        inputs: [{ name: "game_id", type: "core::integer::u32" }],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
      {
        type: "function",
        name: "get_player2",
        inputs: [{ name: "game_id", type: "core::integer::u32" }],
        outputs: [
          { type: "core::starknet::contract_address::ContractAddress" },
        ],
        state_mutability: "view",
      },
    ],
  },
  { type: "constructor", name: "constructor", inputs: [] },
  {
    type: "event",
    name: "connectfour::Connect4::GameCreated",
    kind: "struct",
    members: [
      { name: "game_id", type: "core::integer::u32", kind: "data" },
      {
        name: "player1",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "player2",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      {
        name: "first_turn",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "connectfour::Connect4::MoveMade",
    kind: "struct",
    members: [
      { name: "game_id", type: "core::integer::u32", kind: "data" },
      {
        name: "player",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
      { name: "column", type: "core::integer::u8", kind: "data" },
    ],
  },
  {
    type: "event",
    name: "connectfour::Connect4::GameOver",
    kind: "struct",
    members: [
      { name: "game_id", type: "core::integer::u32", kind: "data" },
      {
        name: "winner",
        type: "core::starknet::contract_address::ContractAddress",
        kind: "data",
      },
    ],
  },
  {
    type: "event",
    name: "connectfour::Connect4::GameDraw",
    kind: "struct",
    members: [{ name: "game_id", type: "core::integer::u32", kind: "data" }],
  },
  {
    type: "event",
    name: "connectfour::Connect4::Event",
    kind: "enum",
    variants: [
      {
        name: "GameCreated",
        type: "connectfour::Connect4::GameCreated",
        kind: "nested",
      },
      {
        name: "MoveMade",
        type: "connectfour::Connect4::MoveMade",
        kind: "nested",
      },
      {
        name: "GameOver",
        type: "connectfour::Connect4::GameOver",
        kind: "nested",
      },
      {
        name: "GameDraw",
        type: "connectfour::Connect4::GameDraw",
        kind: "nested",
      },
    ],
  },
];
