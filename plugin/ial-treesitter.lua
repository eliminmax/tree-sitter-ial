vim.treesitter.language.register('ial', { 'ial' })
-- hook into TSUpdate
vim.api.nvim_create_autocmd('User', { pattern = 'TSUpdate',
    callback = function()
        require("nvim-treesitter.parsers").ial = {
            install_info = {
                path = vim.fn.expand('<script>:p:h:h'),
                generate = true,
                generate_from_json = false,
                queries = 'queries/ial',
            }
        }
    end
})
