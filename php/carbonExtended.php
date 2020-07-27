<?php

use Carbon\Carbon;

class CarbonExtended{

    public static function workingDaysInMonth( $month = false, $year = false )
    {
        $now = Carbon::now();

        if($year === false){
            $year = $now->year;
        }

        if($month === false){
            $totalDays    = $now->daysInMonth;
            $startOfMonth = $now->startOfMonth();

        }else{
            $now          = Carbon::create($year, $month);
            $totalDays    = $now->daysInMonth;
            $startOfMonth = $now->startOfMonth();
        }

        $counter = 0;

        for ($i = 0; $i <= $totalDays; $i++) {

            if($startOfMonth->addDay($i)->isWeekend()){
                $counter += 1;
            }
        }

       return ($totalDays - $counter);
    }
}
