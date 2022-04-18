class ValidationMapService {

    mapErrors(errors) {
        let result = {}

        for(let i of errors) {
            if(!result[i.param])
                result[i.param] = []

            result[i.param].push(i.msg)
        }

        return result
    }
}

module.exports = new ValidationMapService()