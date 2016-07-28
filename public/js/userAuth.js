function addLinkListen(){
    var switchBtn=document.getElementById('switchbtn');
    if(switchBtn)switchBtn.onclick=swithForm;  
}
function swithForm() {
    if (!document.getElementById) return false;
    if (!document.getElementById('switchbtn')) return false;
    if(!document.getElementById('userPost')) return false;
    var switchbtn = document.getElementById('switchbtn');
    var formType = switchbtn.getAttribute('title');
    //btnNames
    var btnReg = document.getElementsByClassName('btnReg')[0];
    //if reg,there is need no email,while not,and delete it
    var email = document.getElementById('email');
    //userPostForm
    var userPost =document.getElementById('userPost');
    //addText
    var attitonText = document.getElementsByClassName('switch_form')[0];
    if (formType == 'login') {
        email.remove();
        btnReg.setAttribute('value', '登录');
        attitonText.innerHTML = '没有帐户？<a href="register" id="switchbtn" title="reg">注册</a>';
        userPost.setAttribute('action','/user/login');
    }else if (formType == 'reg') {
        var email_form = document.createElement('li');
        email_form.setAttribute('class', 'email');
        email_form.innerHTML = "<p class='subform'><label for=‘passwords’><input type='email' name='usermail' id='email' required='' placeholder='邮箱'> </label></p>";
        var ulList = document.getElementsByClassName('regList')[0].getElementsByTagName('li')[1];
        ulList.appendChild(email_form);
        btnReg.setAttribute('value', '注册');
        userPost.setAttribute('action','/user/register');
        attitonText.innerHTML = '有账户了？请<a href="login" id="switchbtn" title="login">登录</a>';
    }
    addLinkListen();
    return false;
}
addLinkListen();
