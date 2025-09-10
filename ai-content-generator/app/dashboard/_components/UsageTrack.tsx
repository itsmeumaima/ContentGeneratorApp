"use client"
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { db } from '@/utils/db';
import { AIOutput } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { HISTORY } from '../history/page';

function UsageTrack() {
    const {user}=useUser();
    const [totalUsage,setTotalUsage]=useState();
    useEffect(()=>{
        user&&GetData();
    },[user])
    
    const GetData=async()=>{
        {/* @ts-ignore */}
        const result:HISTORY[]=await db.select().from(AIOutput)
        .where(eq(AIOutput?.createdBy,user?.primaryEmailAddress?.emailAddress));

        GetTotalUsage(result);
    }

    const GetTotalUsage=(result:HISTORY[])=>{
        let total:number=0;
        result.forEach(element=>{
            total=total+Number(element.aiResponse?.length)
        });
        console.log(total)
    }
  return (
    <div className='m-5'>
        <div className='bg-blue-600 text-white p-3 rounded-lg'>
            <h2 className='font-medium'>Credits</h2>
            <div className='h-2 bg-[#9981f9] w-full rounded-full mt-3'>
                <div className='h-2 bg-white rounded-full'
                style={{
                    width:'35%'
                }}
                ></div>
            </div>
                <h2 className='text-sm my-2'>350/10,000 credit used</h2>          
        </div>
        <Button variant={'secondary'} className='w-full my-3 text-blue-600'>Upgrade</Button>
    </div>
  )
}

export default UsageTrack