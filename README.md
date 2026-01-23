# tree-sitter-ial

A minimal Treesitter grammar for [IAL](https://github.com/eliminmax/ial), the Intcode assembly dialect I designed.

I'm working on setting up proper integration with [nvim-treesitter](https://github.com/nvim-treesitter/nvim-treesitter), but in the meantime, you can paste the following into your `init.vim` before setting calling `require'nvim-treesitter'.setup`:

```lua
-- register definition of IAL files
vim.filetype.add({extension = {ial = 'ial'}})

-- add a callback to register ial with nvim-treesitter
vim.api.nvim_create_autocmd('User', { pattern = 'TSUpdate',
    callback = function()
        require("nvim-treesitter.parsers").ial = {
            install_info = {
                url = 'https://github.com/eliminmax/tree-sitter-ial.git',
                generate = true,
                generate_from_json = true,
                queries = 'queries',
            }
        }
    end
})
```

Create a file at `~/.config/nvim/ftplugin/ial.vim` that actually enables treesitter for IAL source files:
```vim
if v:lua.vim.version().major >= 0 || v:lua.vim.version().minor >= 11
    lua vim.treesitter.start()
endif
```
