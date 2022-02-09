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
            break;
        
        case '/create_user.html':
            document.getElementById('create-btn').addEventListener('click', () => {
                return usersModule.createUser()
            })

            document.getElementById('cancel-btn').addEventListener('click', () => {
                return window.location.href = '/'
            })
            break;
            
        case '/edit.html':
            const uid = window.location.search.split('?uid=')[1]
            if (!uid){
                alert("ユーザーが選択されていません。")
                return window.location.href = '/'
            }else{
                document.getElementById('save-btn').addEventListener('click', () => {
                    return usersModule.editUser(uid)
                })

                document.getElementById('delete-btn').addEventListener('click', () => {
                    return usersModule.deleteUser(uid)
                })

                document.getElementById('cancel-btn').addEventListener('click', () => {
                    return window.location.href = '/'
                })
                return usersModule.fetchOneUser(uid)
            }
            break;
        default:
            break;


    }
})()

