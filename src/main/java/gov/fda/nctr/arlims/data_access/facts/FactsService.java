package gov.fda.nctr.arlims.data_access.facts;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;


@Service
public class FactsService
{
    RestTemplate restTemplate;

    public FactsService()
    {
        this.restTemplate = new RestTemplate();
    }


}
