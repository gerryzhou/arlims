package gov.fda.nctr.arlims;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Service;

import gov.fda.nctr.arlims.data_access.ServiceBase;
import gov.fda.nctr.arlims.data_access.facts.SampleRefreshService;


@Service
public class ScheduledTasksService extends ServiceBase implements SchedulingConfigurer
{
    private int threadPoolSize;

    private SampleRefreshService sampleRefreshService;

    public ScheduledTasksService
        (
            @Value("${scheduling.thread-pool-size:5}") int threadPoolSize,
            SampleRefreshService sampleRefreshService
        )
    {
        this.threadPoolSize = threadPoolSize;
        this.sampleRefreshService = sampleRefreshService;
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
    public void refreshSamplesFromFacts()
    {

        log.info("[scheduled task start] Refreshing sample and employee assignment information from FACTS.");

        sampleRefreshService.refreshSamplesFromFacts();

        log.info("[scheduled task end] Finished refreshing sample and employee assignment information from FACTS.");
    }
}
