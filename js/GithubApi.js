export class GithubApi {
    
        static search(username){
            
            const endPoit = `https://api.github.com/users/${username}`
    
            return fetch(endPoit).then(data => data.json())
            .then(({login, name, public_repos, followers})=>
            ({
            login,
            name,
            public_repos,
            followers
        }))
        }
    
    
}