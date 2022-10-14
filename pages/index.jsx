import { useState, useEffect } from 'react';
import { RedshiftDataClient, DescribeStatementCommand, ExecuteStatementCommand, GetStatementResultCommand} from "@aws-sdk/client-redshift-data";
import Open_Windows from '../components/open_windows';


export default function HomePage() {

 
  return (
    <div>
      <Open_Windows/>
    </div>
  );
}