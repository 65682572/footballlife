<?php

$res = exec("cd /home/wwwroot/www.msu7.net/ && git pull", $retval);
var_dump($res);
var_dump($retval);