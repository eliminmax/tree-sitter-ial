local M = {}

function M.setup(arg)
    vim.api.nvim_create_autocmd('User', { pattern = 'TSUpdate',
        callback = function()
            require("nvim-treesitter.parsers").ial = {
                install_info = {
                    url = 'https://github.com/eliminmax/tree-sitter-ial',
                    branch = 'main',
                    generate = true,
                    generate_from_json = true,
                    queries = 'queries',
                }
            }
        end
    }
    vim.treesitter.language.register('ial', { 'ial' })
end

return M
