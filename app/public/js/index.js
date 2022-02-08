const indexModule = (() => {
    const path = window.location.pathname

    switch (path) {
        case '/':
            //検索ボタンをクリックしたときのイベントリスナー
            document.getElementById('search-btn').addEventListener('click', () => {
                return searchModule.searchUsers()
            })

            // UserのfetchUsersメソッドを呼び出す
            return usersModule.fetchAllUsers()
            
        
        case '/create_user.html':
            document.getElementById('create-btn').addEventListener('click', () => {
                return usersModule.createUser()
            })

            document.getElementById('cancel-btn').addEventListener('click', () => {
                return window.location.href = '/'
            })
            break;
        default:
            break;


    }
})()

