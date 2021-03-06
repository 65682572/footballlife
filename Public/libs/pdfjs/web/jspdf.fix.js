    /** 
     * jsPDF 0.1 (experimental) fix  
     * (c) 2009 KimmKing 
     *  
     * fix jsPDF for IE~~, based on the ActiveX: FileSystemObject  
     */  
      
     var __ua__ = navigator.userAgent.toLowerCase();  
      
     var qsoft = {   
            prefx : 'qsoft',  
            isIE : __ua__.indexOf("msie") > -1,  
            isIE6 : __ua__.indexOf("msie 6") > -1,  
            isIE7 : __ua__.indexOf("msie 7") > -1,  
            isSafari : __ua__.indexOf("safari") > -1,  
            isChrome : __ua__.indexOf("chrome") > -1,  
            //fso:{},  
            getTempFolder : function ()  
            {  
                return qsoft.fso.GetSpecialFolder(2);    
            },  
            crTempFile : function (filename)  
            {  
                return qsoft.fso.CreateTextFile(filename, true);   
            },  
            openPdf : function (pdfText,bBlank, pdfName)  
            {  
                var filename ;  
                  
                if(qsoft.isIE)  
                {  
            if(typeof(qsoft.fso) == 'undefined')  
            {  
                alert('调用FSO出错，请降低IE安全设置，刷新页面并重试。');  
                return ;  
            }  
                    var tempFolder = qsoft.getTempFolder();  
                    var name = pdfName || "qsoft";  
                    filename = tempFolder + "/" + name + ".pdf" ;  
                    var f = qsoft.crTempFile(filename);  
                    f.WriteLine(pdfText);  
                    f.Close();  
                }  
                else  
                {  
                   filename =  'data:application/pdf;base64,' + Base64.encode(pdfText);  
                }  
                  
                if(bBlank)  
                {  
                    window.open(filename);  
                }  
                else  
                {  
                    document.location.href = filename;  
                }  
                  
            }  
        }  
          
      
            if(qsoft.isIE)  
            {  
                try{  
                    qsoft.fso = new ActiveXObject("Scripting.FileSystemObject");  
                }  
                catch(e)  
                {  
                    alert("请降低IE的安全级别。");  
                }  
            }  