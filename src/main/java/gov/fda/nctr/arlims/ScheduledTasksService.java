package gov.fda.nctr.arlims;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.sample_ops_refresh.SampleOpRefreshService;


@Service
public class ScheduledTasksService extends ServiceBase implements SchedulingConfigurer
{
    private int threadPoolSize;

    private SampleOpRefreshService sampleOpRefreshService;

    public ScheduledTasksService
        (
            @Value("${scheduling.thread-pool-size:5}") int threadPoolSize,
            SampleOpRefreshService sampleOpRefreshService
        )
    {
        this.threadPoolSize = threadPoolSize;
        this.sampleOpRefreshService = sampleOpRefreshService;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar)
    {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(threadPoolSize);

        log.info("Reserving " + threadPoolSize + " threads for scheduled tasks.");

        scheduler.setThreadNamePrefix("app-task-scheduler-");

        scheduler.initialize();

        scheduledTaskRegistrar.setTaskScheduler(scheduler);
    }


    @Scheduled(cron = "${scheduling.facts-sample-refresh.cron}")
    public void refreshSampleOpsFromFacts()
    {

        log.info("[scheduled task start] Refreshing sample and employee assignment information from FACTS.");

        sampleOpRefreshService.refreshSampleOpsFromFacts();

        log.info("[scheduled task end] Finished refreshing sample and employee assignment information from FACTS.");
    }
}
