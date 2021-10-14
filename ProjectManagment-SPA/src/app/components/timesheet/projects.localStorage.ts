const _localStorageKey = "data.projects"
export const getProjectsLS = () => { 
    const restString = window.localStorage.getItem(_localStorageKey);
    let restArray = [];
    try {
        restArray = restString!== null ? JSON.parse(restString) : '{}'
    } catch (ex) {
        console.log(ex)
    }
    return restArray;
}

export const setProjectsLS = (rest: Array<any>) => {
    window.localStorage.setItem(_localStorageKey, JSON.stringify(rest))
}