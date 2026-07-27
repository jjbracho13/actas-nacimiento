package com.cne.actas;

import android.app.DownloadManager;
import android.content.Context;
import android.net.Uri;
import android.os.Environment;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "PdfDownloader")
public class PdfDownloaderPlugin extends Plugin {

    @PluginMethod
    public void download(PluginCall call) {
        String url = call.getString("url");
        String filename = call.getString("filename");

        if (url == null || filename == null) {
            call.reject("url and filename are required");
            return;
        }

        Context context = getContext();
        DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
        request.setTitle("Actas CNE");
        request.setDescription("Descargando " + filename);
        request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
        request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, "ActasCNE/" + filename);
        request.setMimeType("application/pdf");

        DownloadManager manager = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
        long downloadId = manager.enqueue(request);

        JSObject result = new JSObject();
        result.put("downloadId", downloadId);
        call.resolve(result);
    }
}
