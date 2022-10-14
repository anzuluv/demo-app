import { useState, useEffect } from 'react';
import { RedshiftDataClient, DescribeStatementCommand, ExecuteStatementCommand, GetStatementResultCommand} from "@aws-sdk/client-redshift-data";


export default function Open_Windows() {

  const client = new RedshiftDataClient({region:"us-west-2",accessKeyId:"AKIAXMAQ7EXAZKJ27HGV",secretAccessKey:"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"});
  const params = {
    ClusterIdentifier: "redshift-cluster-filmdb",
    Database: "availsdb",
    DbUser: "awsuser",
    Sql: "SELECT * FROM open_windows LIMIT 5"
  };

  const command = new ExecuteStatementCommand(params);


  const execute = async () => {
    try {
      const data = await client.send(command);
      

     
      var describe_command = new DescribeStatementCommand({Id:data.Id});
      var describe = await client.send(describe_command);
      while (['PICKED','SUBMITTED','STARTED'].includes(describe.Status)) {
        describe_command = new DescribeStatementCommand({Id:data.Id});
        describe = await client.send(describe_command);
     }
      if (describe.Status === "FINISHED") {
        const result_command = new GetStatementResultCommand({Id:data.Id});
        const response = await client.send(result_command);
        var list = [];
        var child = {}
        
        for (let record of response.Records){
          child = {}
          for (let i = 0; i < response.ColumnMetadata.length; i++) {
            child[response.ColumnMetadata[i].name] = Object.values(record[i])[0]
                     }
          list.push(child);
        } 
      return list;
    }
  
      }
    
  catch (error) {
    console.log('ExecuteStatement has failed.');
    throw error;
  }

  
  };


    (async () => {
        try {
            let display = await execute();
            console.log(display)
         
        }
        catch(err){
            console.log(err.message)
        }
        })();



  

  return (
    <div>
      
    </div>
  );
}