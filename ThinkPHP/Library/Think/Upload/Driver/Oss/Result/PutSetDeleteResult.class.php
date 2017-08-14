<?php

namespace Think\Upload\Driver\Oss\Result;


/**
 * Class PutSetDeleteResult
 * @package OSS\Result
 */
class PutSetDeleteResult extends Result
{
    /**
     * @return null
     */
    protected function parseDataFromResponse()
    {
		$data   = $this->getRawResponse();
		
		$result = array('status' => $data->status);
		if($this->isOk == true){
			$result['url']    = $data->header['oss-request-url'];
			$result['content-type']    = $data->header['oss-requestheaders']['Content-Type'];
			
		}
		
        return $result;
    }
}