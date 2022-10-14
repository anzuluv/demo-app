import json
import urllib.parse
import boto3
import botocore.session as bc

print('loading function')

def lambda_handler(event, context):
    print('entered lambda handler')

    session = boto3.session.Session()
    region = session.region_name
    secret_db_user = event['db-user']
    secret_cluster_id = event['cluster-identifier']
    

    bc_session = bc.get_session()

    session = boto3.Session(botocore_session=bc_session, region_name=region)

    client_redshift = session.client('redshift-data')
    print('Data API client successfully loaded')
    
    query_str = "SELECT * from open_windows limit 5"

    res = client_redshift.execute_statement(
        Database = 'availsdb',
        DbUser = secret_db_user, 
        Sql = query_str, 
        ClusterIdentifier = secret_cluster_id)

    query_id = res["Id"]
    desc = client_redshift.describe_statement(Id=query_id)
    query_status = desc["Status"]

    if query_status == "FAILED":
        raise Exception('SQL query failed: ' + desc["Error"])
    elif query_status == "FINISHED":
        if desc["HasResultSet"]:
            response = client_redshift.get_statement_result(Id=query_id)
            print(response)
