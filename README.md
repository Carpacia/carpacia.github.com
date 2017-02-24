# Resume

Web link: [https://carpacia.github.io/](https://carpacia.github.io/)

My name is Raymond.  
This is my resume.  
If you want to contact me, this is my email.  
carpathia.lin@gamil.com  
Thanks!  


###Develop note:
1.  github.io 有link錯誤的問題
https://github.com/robwierzbowski/generator-jekyllrb/issues/134  
一開始我把整個node_modual都傳上來，但是發現index.html裡link跟scripte會連結不到檔案，網路查了一段時間都沒有什麼好辦法，後來想到了一個辦法，是利用gulp將需要用到的檔案複製到外面的資料夾，這樣只要link到外面的資料夾就找的到了，node_module也不用傳上來，就也減少了很多空間，一舉兩得！


2.  svg有時圖片會沉到object下   
使用object來包svg圖片，有時圖片不會出來，debug了半天原來是高度沒設定啊！
一直以為svg圖片會固定比例拉大，只要設定width就好，設定完寬高就搞定了！
