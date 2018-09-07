package gov.fda.nctr.arlims.data_access.facts.scheduling;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;


@Service
public class ScheduledTasksService extends ServiceBase
{
    @Scheduled(cron = "${facts.scheduling.sample-refresh.cron}")
    public void refreshSamples()
    {
        // TODO
        log.info("refreshSamples()");
    }
}
