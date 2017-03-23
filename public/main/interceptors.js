
function interceptors(request, next) {
    
    next((response) => {
        if(response.status === 200){
            if(response.body && response.body.meta){
                if(response.body.meta.errno !== 0){
                    response.ok = false;
                    response.status = response.body.meta.errno !== undefined ? response.body.meta.errno : response.status;
                    response.statusText = response.body.meta.msg !== undefined ? response.body.meta.msg : response.statusText;
                }
            }else{
                // 慎用
                // response.ok = false;
            }
        }
        return response
    });
}

export default interceptors;