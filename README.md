# tree-sitter-ial

A minimal Treesitter grammar for [IAL](https://github.com/eliminmax/ial), the Intcode assembly dialect I designed, and a Neovim plugin that uses it.

The Neovim plugin hooks into `TSUpdate` from [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter/) to build and install the parser.

## Neovim installation

Set up `nvim-treesitter`, and install this repo with a plugin manager like [vim-plug](https://github.com/junegunn/vim-plug). This repo, when treated as a vim plugin, will automatically hook into `nvim-treesitter` and enable highlighting for IAL files.
