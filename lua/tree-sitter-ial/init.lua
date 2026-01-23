local M = {}

function M.setup(arg)
    require("nvim-treesitter.parsers").ial = {
        install_info = {
            url = arg["local"] and join_paths(
                vim.fn.stdpath("data"),
                "site",
                "pack",
                "packer",
                "start",
                "tree-sitter-ial"
            ) or "https://github.com/eliminmax/tree-sitter-ial",
            branch = "main",
            generate = true,
            generate_from_json = true,
            queries = 'queries',
        }
    }

end

return M
