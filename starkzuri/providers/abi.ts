export const CONTRACT_ADDRESS =
  "0x7c2109cfa8c36fa10c6baac19b234679606cba00eb6697a052b73b869850673";
export const ABI = [
  {
    "name": "StarkZuri",
    "type": "impl",
    "interface_name": "contract::interfaces::IStarkZuriContract"
  },
  {
    "name": "core::byte_array::ByteArray",
    "type": "struct",
    "members": [
      {
        "name": "data",
        "type": "core::array::Array::<core::bytes_31::bytes31>"
      },
      {
        "name": "pending_word",
        "type": "core::felt252"
      },
      {
        "name": "pending_word_len",
        "type": "core::integer::u32"
      }
    ]
  },
  {
    "name": "core::integer::u256",
    "type": "struct",
    "members": [
      {
        "name": "low",
        "type": "core::integer::u128"
      },
      {
        "name": "high",
        "type": "core::integer::u128"
      }
    ]
  },
  {
    "name": "contract::structs::User",
    "type": "struct",
    "members": [
      {
        "name": "userId",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "username",
        "type": "core::felt252"
      },
      {
        "name": "about",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "profile_pic",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "cover_photo",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "date_registered",
        "type": "core::integer::u64"
      },
      {
        "name": "no_of_followers",
        "type": "core::integer::u8"
      },
      {
        "name": "number_following",
        "type": "core::integer::u8"
      },
      {
        "name": "notifications",
        "type": "core::integer::u256"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "core::bool",
    "type": "enum",
    "variants": [
      {
        "name": "False",
        "type": "()"
      },
      {
        "name": "True",
        "type": "()"
      }
    ]
  },
  {
    "name": "contract::structs::Comment",
    "type": "struct",
    "members": [
      {
        "name": "postId",
        "type": "core::integer::u256"
      },
      {
        "name": "commentId",
        "type": "core::integer::u256"
      },
      {
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "content",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "likes",
        "type": "core::integer::u8"
      },
      {
        "name": "replies",
        "type": "core::integer::u8"
      },
      {
        "name": "time_commented",
        "type": "core::integer::u64"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "contract::structs::LightUser",
    "type": "struct",
    "members": [
      {
        "name": "userId",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "name",
        "type": "core::felt252"
      },
      {
        "name": "username",
        "type": "core::felt252"
      },
      {
        "name": "profile_pic",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "contract::structs::PostView",
    "type": "struct",
    "members": [
      {
        "name": "postId",
        "type": "core::integer::u256"
      },
      {
        "name": "author",
        "type": "contract::structs::LightUser"
      },
      {
        "name": "content",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "likes",
        "type": "core::integer::u8"
      },
      {
        "name": "comments",
        "type": "core::integer::u256"
      },
      {
        "name": "shares",
        "type": "core::integer::u8"
      },
      {
        "name": "images",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      },
      {
        "name": "date_posted",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "contract::structs::Post",
    "type": "struct",
    "members": [
      {
        "name": "postId",
        "type": "core::integer::u256"
      },
      {
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "content",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "likes",
        "type": "core::integer::u8"
      },
      {
        "name": "comments",
        "type": "core::integer::u256"
      },
      {
        "name": "shares",
        "type": "core::integer::u8"
      },
      {
        "name": "images",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      },
      {
        "name": "date_posted",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "contract::structs::Community",
    "type": "struct",
    "members": [
      {
        "name": "community_id",
        "type": "core::integer::u256"
      },
      {
        "name": "community_admin",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "community_name",
        "type": "core::felt252"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "members",
        "type": "core::integer::u256"
      },
      {
        "name": "online_members",
        "type": "core::integer::u256"
      },
      {
        "name": "profile_image",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "cover_image",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "contract::structs::Notification",
    "type": "struct",
    "members": [
      {
        "name": "notification_id",
        "type": "core::integer::u256"
      },
      {
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "receiver",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "notification_message",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "notification_type",
        "type": "core::felt252"
      },
      {
        "name": "notification_status",
        "type": "core::felt252"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      }
    ]
  },
  {
    "name": "contract::structs::Reel",
    "type": "struct",
    "members": [
      {
        "name": "reel_id",
        "type": "core::integer::u256"
      },
      {
        "name": "caller",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "name": "likes",
        "type": "core::integer::u256"
      },
      {
        "name": "dislikes",
        "type": "core::integer::u256"
      },
      {
        "name": "comments",
        "type": "core::integer::u256"
      },
      {
        "name": "shares",
        "type": "core::integer::u256"
      },
      {
        "name": "video",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "timestamp",
        "type": "core::integer::u64"
      },
      {
        "name": "description",
        "type": "core::byte_array::ByteArray"
      },
      {
        "name": "zuri_points",
        "type": "core::integer::u256"
      }
    ]
  },
  {
    "name": "contract::interfaces::IStarkZuriContract",
    "type": "interface",
    "items": [
      {
        "name": "get_owner",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "add_user",
        "type": "function",
        "inputs": [
          {
            "name": "name",
            "type": "core::felt252"
          },
          {
            "name": "username",
            "type": "core::felt252"
          },
          {
            "name": "about",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "profile_pic",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "cover_photo",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_user",
        "type": "function",
        "inputs": [
          {
            "name": "user_id",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "contract::structs::User"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_user_count",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_all_users",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::User>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "follow_user",
        "type": "function",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "follower_exist",
        "type": "function",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_followers",
        "type": "function",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::User>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "upgrade",
        "type": "function",
        "inputs": [
          {
            "name": "impl_hash",
            "type": "core::starknet::class_hash::ClassHash"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "version",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "create_post",
        "type": "function",
        "inputs": [
          {
            "name": "content",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "images",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "like_post",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "unlike_post",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_likes",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::User>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "comment_on_post",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          },
          {
            "name": "content",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_comments",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Comment>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_posts",
        "type": "function",
        "inputs": [
          {
            "name": "page",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::PostView>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "filter_post",
        "type": "function",
        "inputs": [
          {
            "name": "user",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Post>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_post",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "contract::structs::Post"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "create_community",
        "type": "function",
        "inputs": [
          {
            "name": "community_name",
            "type": "core::felt252"
          },
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "profile_image",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "cover_image",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "list_communities",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Community>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "join_community",
        "type": "function",
        "inputs": [
          {
            "name": "community_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "member_exist",
        "type": "function",
        "inputs": [
          {
            "name": "community_id",
            "type": "core::integer::u256"
          },
          {
            "name": "userId",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::bool"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_community_members",
        "type": "function",
        "inputs": [
          {
            "name": "community_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::User>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "trigger_notification",
        "type": "function",
        "inputs": [
          {
            "name": "caller",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_notifications",
        "type": "function",
        "inputs": [
          {
            "name": "account_name",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Notification>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "create_reel",
        "type": "function",
        "inputs": [
          {
            "name": "description",
            "type": "core::byte_array::ByteArray"
          },
          {
            "name": "video",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_reels",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Reel>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "view_reels_for_account",
        "type": "function",
        "inputs": [
          {
            "name": "owner",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Reel>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "like_reel",
        "type": "function",
        "inputs": [
          {
            "name": "reel_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "dislike_reel",
        "type": "function",
        "inputs": [
          {
            "name": "reel_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "comment_on_reel",
        "type": "function",
        "inputs": [
          {
            "name": "reel_id",
            "type": "core::integer::u256"
          },
          {
            "name": "content",
            "type": "core::byte_array::ByteArray"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_reel_comments",
        "type": "function",
        "inputs": [
          {
            "name": "reel_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [
          {
            "type": "core::array::Array::<contract::structs::Comment>"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "repost_reel",
        "type": "function",
        "inputs": [
          {
            "name": "reel_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "claim_reel_points",
        "type": "function",
        "inputs": [
          {
            "name": "reel_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "claim_post_points",
        "type": "function",
        "inputs": [
          {
            "name": "post_id",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "add_token_address",
        "type": "function",
        "inputs": [
          {
            "name": "token_name",
            "type": "core::felt252"
          },
          {
            "name": "token_address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "deposit_fee",
        "type": "function",
        "inputs": [
          {
            "name": "receiver",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      },
      {
        "name": "view_contract_balance",
        "type": "function",
        "inputs": [
          {
            "name": "address",
            "type": "core::starknet::contract_address::ContractAddress"
          }
        ],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "get_total_posts",
        "type": "function",
        "inputs": [],
        "outputs": [
          {
            "type": "core::integer::u256"
          }
        ],
        "state_mutability": "view"
      },
      {
        "name": "withdraw_zuri_points",
        "type": "function",
        "inputs": [
          {
            "name": "amount",
            "type": "core::integer::u256"
          }
        ],
        "outputs": [],
        "state_mutability": "external"
      }
    ]
  },
  {
    "name": "constructor",
    "type": "constructor",
    "inputs": [
      {
        "name": "address",
        "type": "core::starknet::contract_address::ContractAddress"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "contract::starkzuri::StarkZuri::Upgraded",
    "type": "event",
    "members": [
      {
        "kind": "data",
        "name": "implementation",
        "type": "core::starknet::class_hash::ClassHash"
      }
    ]
  },
  {
    "kind": "struct",
    "name": "contract::starkzuri::StarkZuri::NewUserRegistered",
    "type": "event",
    "members": [
      {
        "kind": "key",
        "name": "userId",
        "type": "core::starknet::contract_address::ContractAddress"
      },
      {
        "kind": "data",
        "name": "name",
        "type": "core::felt252"
      }
    ]
  },
  {
    "kind": "enum",
    "name": "contract::starkzuri::StarkZuri::Event",
    "type": "event",
    "variants": [
      {
        "kind": "nested",
        "name": "Upgraded",
        "type": "contract::starkzuri::StarkZuri::Upgraded"
      },
      {
        "kind": "nested",
        "name": "NewUserRegistered",
        "type": "contract::starkzuri::StarkZuri::NewUserRegistered"
      }
    ]
  }
]
