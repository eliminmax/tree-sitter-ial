local M = {}

function M.setup(arg)
    require("nvim-treesitter.parsers").ial = {
        install_info = {
            vim.fn.expand("%:p:h:h:h"),
            branch = "main",
            generate = true,
            generate_from_json = true,
            queries = 'queries',
        }
    }

end

return M
