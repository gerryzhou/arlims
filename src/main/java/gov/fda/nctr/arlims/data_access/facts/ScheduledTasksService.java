package gov.fda.nctr.arlims.data_access.facts;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import gov.fda.nctr.arlims.data_access.ServiceBase;


@Service
public class ScheduledTasksService extends ServiceBase implements SchedulingConfigurer
{
    private FactsService factsService;
    private int threadPoolSize;

    public ScheduledTasksService
        (
            FactsService factsService,
            @Value("${facts.scheduling.thread-pool-size:5}") int threadPoolSize
        )
    {
        this.factsService = factsService;
        this.threadPoolSize = threadPoolSize;
    }

    @Override
    public void configureTasks(ScheduledTaskRegistrar scheduledTaskRegistrar)
    {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();

        scheduler.setPoolSize(threadPoolSize);

        log.info("Reserving " + threadPoolSize + " threads for FACTS scheduling.");

        scheduler.setThreadNamePrefix("facts-scheduler-");

        scheduler.initialize();

        scheduledTaskRegistrar.setTaskScheduler(scheduler);
    }


    @Scheduled(cron = "${facts.scheduling.sample-refresh.cron}")
    public void refreshSamples()
    {
        // TODO
        log.info("[scheduled task] refreshSamples()");
    }
}
