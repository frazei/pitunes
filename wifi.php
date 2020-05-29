<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo exec('sudo iwlist wlan0 scan', $output, $return_var);

$results = Array();
$mac = null;
foreach ($output as $ln => $line) {
    $line = trim($line);
    //echo "[$ln] $line";
    if ($ln == 0) {
        if (strstr($line, 'completed')) {
            //echo "SCAN COMPLETED";
        } else {
            //echo "SCAN ERROR";
            exit();
        }
    }
    if(strpos($line, 'Cell') === 0) {
        // da qui inizia un blocco
        $mac = substr($line, -17);
        //echo 'MAC:'.$mac;
        $results[$mac] = Array();
    }
    if(strpos($line, 'Frequency') === 0) {
        $results[$mac]['Frequency'] = substr($line, 10);
    }
    if(strpos($line, 'Quality') === 0) {
        $results[$mac]['Quality'] = substr($line, 8, 5);
        $results[$mac]['Signal level'] = substr($line, -7);
    }
    if(strpos($line, 'Encryption key') === 0) {
        $results[$mac]['Open'] = (substr($line, -2) == 'on') ? false : true;
    }
    if(strpos($line, 'ESSID') === 0) {
        $results[$mac]['ESSID'] = substr($line, 6);
    }
    //echo "<br/>";
}

//echo "<hr/>";
//echo "<pre>".print_r($results,1)."</pre>";

echo json_encode($results);
