<?php

/**
* 
*/
class getgailu
{   
    /*
     * 概率算法，
     * $proArr是一个预先设置的数组，
     * 假设数组为：array(100,200,300，400)，
     * 开始是从1,1000 这个概率范围内筛选第一个数是否在他的出现概率范围之内， 
     * 如果不在，则将概率空间，也就是k的值减去刚刚的那个数字的概率空间，
     */
    static public function get_rand($proArr) { 
        $result = '';  
        //概率数组的总概率精度
        $proSum = array_sum($proArr);
        //概率数组循环 
        foreach ($proArr as $key => $proCur) { 
            $randNum = mt_rand(1, $proSum); 
            if ($randNum <= $proCur) { 
                $result = $key; 
                break; 
            } else { 
                $proSum -= $proCur; 
            }       
        } 
        unset ($proArr);  
        return $result; 
    } 

    public function gailu($prize_arr,$t){
    /*
     * 概率抽取
     * 注意其中的v为抽中概率必须为整数，你可以将对应项的v设置成0，即意味着该项抽中的几率是0，
     * 数组中v的总和（基数），基数越大越能体现概率的准确性。
     * 本例中v的总和为100，那么平板电脑对应的 中奖概率就是1%，
     * 如果v的总和是10000，那中奖概率就是万分之一了。
     * 
     * 通过概率计算函数get_rand获取抽中的奖项id。
     * 将抽中的数组保存在数组$res['yes']中，
     * 而剩下的未抽中的信息保存在$res['no']中，
     * $t是类型，不同的类型随机的逻辑不同 1表示进球概率(暂时未使用T)
     */
        //取出v值组成新数组，用于抽取概率
        foreach ($prize_arr as $key => $val) { 
            $arr[$val['id']] = $val['v']; 
        }
        shuffle($arr);
        // $rid = '';  
        // //概率数组的总概率精度
        // $proSum = array_sum($arr);
        // //概率数组循环 
        // foreach ($arr as $key => $proCur) { 
        //     $randNum = mt_rand(1, $proSum); 
        //     if ($randNum <= $proCur) {
        //         //如果随机数在概率之内则结束循环 
        //         $rid = $key; 
        //         break; 
        //     } else {
        //         //否则减少总概率，缩小抽取范围，提高抽取精准度 
        //         $proSum -= $proCur; 
        //     }       
        // } 
        // unset ($arr);
        $rid = getgailu::get_rand($arr); //根据概率获取奖项id
        $res['yes'] = $prize_arr[$rid]; //中奖项

        unset($prize_arr[$rid]); //将中奖项从数组中剔除，剩下未中奖项 
        shuffle($prize_arr); //打乱数组顺序 
        for($i=0;$i<count($prize_arr);$i++){ 
            $pr[] = $prize_arr[$i]; 
        } 
        $res['no'] = $pr; 
        return $res;
    }
}